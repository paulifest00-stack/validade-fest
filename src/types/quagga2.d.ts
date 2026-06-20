declare module "@ericblade/quagga2" {
  export interface QuaggaConfig {
    inputStream?: {
      name?: string;
      type?: string;
      target?: HTMLElement | string;
      constraints?: {
        width?: { min?: number; max?: number } | number;
        height?: { min?: number; max?: number } | number;
        facingMode?: string;
      };
    };
    decoder?: {
      readers?: string[];
      debug?: {
        showCanvas?: boolean;
        showPatternLabels?: boolean;
        showFrequency?: boolean;
        showSkeleton?: boolean;
        showScatter?: boolean;
        logLevel?: number;
      };
    };
    locator?: {
      halfSample?: boolean;
      patchSize?: string;
    };
    numOfWorkers?: number;
    frequency?: number;
  }

  export interface CodeResult {
    code: string;
    format: string;
    confidence: number;
  }

  export interface DetectionResult {
    codeResult: CodeResult;
    boxes?: any[];
    lines?: any[];
  }

  export interface Quagga {
    init(config: QuaggaConfig, callback?: (err?: any) => void): Promise<void>;
    start(): void;
    stop(): Promise<void>;
    onDetected(callback: (result: DetectionResult) => void): void;
    offDetected(callback: (result: DetectionResult) => void): void;
  }

  const Quagga: Quagga;
  export default Quagga;
}
