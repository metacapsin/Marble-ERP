/**
 * Utility class for area conversions between different units
 */
export class AreaConversions {
  // Constants
  private static readonly SQUARE_FEET_TO_SQUARE_METERS = 0.092903;
  private static readonly SQUARE_METERS_TO_SQUARE_FEET = 10.7639;
  private static readonly SQUARE_INCHES_TO_SQUARE_FEET = 144;
  private static readonly SQUARE_INCHES_TO_SQUARE_METERS = 1550.0031;

  /**
   * Calculate area in square meters from length and width in meters
   */
  static calculateAreaInSquareMeters(
    lengthInMeters: number,
    widthInMeters: number
  ): number {
    if (lengthInMeters <= 0 || widthInMeters <= 0) return 0;
    return Number((lengthInMeters * widthInMeters).toFixed(4));
  }

  /**
   * Calculate area in square feet from length and width in meters
   */
  static calculateAreaInSquareFeet(
    lengthInMeters: number,
    widthInMeters: number
  ): number {
    if (lengthInMeters <= 0 || widthInMeters <= 0) return 0;
    const areaInSquareMeters = this.calculateAreaInSquareMeters(
      lengthInMeters,
      widthInMeters
    );
    return Number(
      (areaInSquareMeters * this.SQUARE_METERS_TO_SQUARE_FEET).toFixed(4)
    );
  }

  /**
   * Convert inches to square feet
   */
  static inchesToSquareFeet(
    lengthInInches: number,
    widthInInches: number
  ): number {
    if (lengthInInches <= 0 || widthInInches <= 0) return 0;
    return Number(
      (
        (lengthInInches * widthInInches) /
        this.SQUARE_INCHES_TO_SQUARE_FEET
      ).toFixed(4)
    );
  }

  /**
   * Convert inches to square meters
   */
  static inchesToSquareMeters(
    lengthInInches: number,
    widthInInches: number
  ): number {
    if (lengthInInches <= 0 || widthInInches <= 0) return 0;
    return Number(
      (
        (lengthInInches * widthInInches) /
        this.SQUARE_INCHES_TO_SQUARE_METERS
      ).toFixed(4)
    );
  }

  /**
   * Convert total square feet to square meters
   */
  static squareFeetToSquareMeters(squareFeet: number): number {
    if (squareFeet <= 0) return 0;
    return Number((squareFeet * this.SQUARE_FEET_TO_SQUARE_METERS).toFixed(4));
  }

  /**
   * Convert total square meters to square feet
   */
  static squareMetersToSquareFeet(squareMeters: number): number {
    if (squareMeters <= 0) return 0;
    return Number(
      (squareMeters * this.SQUARE_METERS_TO_SQUARE_FEET).toFixed(4)
    );
  }

  /**
   * Validate dimensions
   */
  static validateMetricDimensions(length: number, width: number): boolean {
    return length > 0 && width > 0 && length <= 5 && width <= 4;
  }

  /**
   * Calculate dimensions and return both square feet and square meters
   */
  static calculateArea(
    length: number,
    width: number,
    unit: "inches" | "meters"
  ): {
    squareFeet: number;
    squareMeters: number;
  } {
    let squareFeet = 0;
    let squareMeters = 0;

    if (unit === "inches") {
      squareFeet = this.inchesToSquareFeet(length, width);
      squareMeters = this.inchesToSquareMeters(length, width);
    } else {
      squareFeet = this.calculateAreaInSquareFeet(length, width);
      squareMeters = this.calculateAreaInSquareMeters(length, width);
    }

    return {
      squareFeet: Number(squareFeet.toFixed(4)),
      squareMeters: Number(squareMeters.toFixed(4)),
    };
  }

  /**
   * Calculate total quantities from rows
   */
  static calculateTotalQuantities(rows: any[]): {
    totalQuantity: number;
    totalQuantityMeter: number;
  } {
    const totalQuantity = rows.reduce((sum, row) => {
      const qty = parseFloat(row.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);

    const totalQuantityMeter = rows.reduce((sum, row) => {
      const qty = parseFloat(row.totalQuantityMeter);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);

    return {
      totalQuantity: Number(totalQuantity.toFixed(4)),
      totalQuantityMeter: Number(totalQuantityMeter.toFixed(4)),
    };
  }

  /**
   * Convert feet to meters
   */
  static calculateFeetToMeter(value: number): number {
    if (value <= 0) return 0;
    return Number((value / 3.281).toFixed(4));
  }

  /**
   * Convert meters to feet
   */
  static calculateMeterToFeet(value: number): number {
    if (value <= 0) return 0;
    return Number((value * 3.281).toFixed(4));
  }

  static convertRatePerSQMT(ratePerSqFeet) {
    return Number((ratePerSqFeet * 10.7639).toFixed(4));
  }
  static convertRatePerSQFT(ratePerSqMeter) {
    return Number((ratePerSqMeter / 10.7639).toFixed(4));
  }
}
