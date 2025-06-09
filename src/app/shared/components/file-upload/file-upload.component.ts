import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadService } from './file-upload.service';

interface FileItem {
  file: File;
  id: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  path?: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges {
  @Input() type: string = 'blocks';
  @Input() existingAttachments: any[] = [];
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() uploadComplete = new EventEmitter<any>();
  @Output() fileDeleted = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput: ElementRef;
  
  selectedFiles: FileItem[] = [];
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  isUploading: boolean = false;

  constructor(
    private messageService: MessageService,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.restoreExistingAttachments();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingAttachments']) {
      this.restoreExistingAttachments();
    }
  }
  
  private restoreExistingAttachments(): void {
    if (this.existingAttachments && this.existingAttachments.length > 0) {
      // Clear existing files to avoid duplicates
      this.selectedFiles = this.existingAttachments.map(attachment => {
        // Create a placeholder file since we can't recreate the original file
        const filename = attachment.filename || attachment.name || 'file';
        
        // Create a buffer with some data to make sure the file has a size
        // Use the file's size if available, otherwise use a default size
        const fileSize = attachment.size || attachment.file?.size || 1024;
        const buffer = new ArrayBuffer(Math.min(fileSize, 1024)); // Use at least some data but not too much
        
        const placeholderFile = new File([
          buffer
        ], filename, {
          type: attachment.mimetype || attachment.type || 'application/octet-stream',
          lastModified: attachment.lastModified || Date.now()
        });
        
        // Set custom size property if the real size is known
        if (attachment.size && attachment.size > 1024) {
          Object.defineProperty(placeholderFile, 'size', {
            value: attachment.size,
            writable: false
          });
        }
        
        return {
          file: placeholderFile,
          id: attachment._id || attachment.id || this.generateUniqueId(),
          uploadStatus: 'success',
          path: attachment.path,
          size: attachment.size || fileSize // Store the size separately as well
        };
      });
      
      // Emit the restored files
      this.emitFiles();
    }
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > this.MAX_FILE_SIZE) {
        this.messageService.add({
          severity: 'error',
          summary: 'File Size Error',
          detail: `File "${file.name}" exceeds maximum size of 10MB`
        });
        this.resetFileInput();
        return;
      }

      // Add new file to the array instead of replacing
      const fileItem: FileItem = {
        file: file,
        id: this.generateUniqueId(),
        uploadStatus: 'pending'
      };
      this.selectedFiles.push(fileItem);
      
      this.uploadFiles();
      this.emitFiles();
    }
  }

  private uploadFiles(): void {
    const pendingFiles = this.selectedFiles
      .filter(item => item.uploadStatus === 'pending')
      .map(item => item.file);

    if (pendingFiles.length === 0) return;

    this.isUploading = true;
    this.selectedFiles
      .filter(item => item.uploadStatus === 'pending')
      .forEach(item => item.uploadStatus = 'uploading');

    this.uploadService.uploadFiles(this.type, pendingFiles)
      .subscribe({
        next: (response) => {
          if (response && response.status === "success" && response.data && response.data.length > 0) {
            // Update only the files that were just uploaded
            this.selectedFiles = this.selectedFiles.map(item => {
              if (item.uploadStatus === 'uploading') {
                return {
                  ...item,
                  uploadStatus: 'success',
                  path: response.data[0].path,
                  id: response.data[0]._id
                };
              }
              return item;
            });
            
            this.uploadComplete.emit(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Upload Complete',
              detail: 'File has been uploaded successfully'
            });
          } else {
            // Remove only the files that failed to upload
            this.selectedFiles = this.selectedFiles.filter(item => item.uploadStatus !== 'uploading');
            this.messageService.add({
              severity: 'error',
              summary: 'Upload Failed',
              detail: response.message || 'Failed to upload file. Please try again.'
            });
          }
          this.isUploading = false;
          this.resetFileInput();
        },
        error: (error) => {
          // Update status of failed uploads
          this.selectedFiles = this.selectedFiles.map(item => {
            if (item.uploadStatus === 'uploading') {
              return {
                ...item,
                uploadStatus: 'error',
                uploadError: 'Upload failed'
              };
            }
            return item;
          });
          
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload file. Please try again.'
          });
          this.isUploading = false;
          this.resetFileInput();
        }
      });
  }

  removeFile(fileId: string, event?: Event): void {
    // Prevent the default action to avoid form submission
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const fileItem = this.selectedFiles.find(f => f.id === fileId);
    if (!fileItem) return;

    if (fileItem.uploadStatus === 'success' && fileItem.path) {
      this.uploadService.deleteFile(fileItem.file.name, fileItem.path)
        .subscribe({
          next: (response) => {
            this.selectedFiles = this.selectedFiles.filter(f => f.id !== fileId);
            this.emitFiles();
            // Emit the deleted file information
            this.fileDeleted.emit({ id: fileId, response });
            this.messageService.add({
              severity: 'success',
              summary: 'File Deleted',
              detail: 'File has been deleted successfully'
            });
            this.resetFileInput();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: 'Failed to delete file. Please try again.'
            });
          }
        });
    } else {
      this.selectedFiles = this.selectedFiles.filter(f => f.id !== fileId);
      // Emit the deleted file information for non-uploaded files too
      this.fileDeleted.emit({ id: fileId });
      this.emitFiles();
      this.resetFileInput();
    }
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private emitFiles(): void {
    this.filesChanged.emit(this.selectedFiles.map(f => f.file));
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'pdf':
        return 'fa-file-pdf-o';
      case 'doc':
      case 'docx':
        return 'fa-file-word-o';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fa-file-image-o';
      default:
        return 'fa-file-o';
    }
  }

  getFileSize(size: number): string {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }
} 