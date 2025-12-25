import { Injectable } from '@nestjs/common';

export interface FileMetadata {
  id: string;
  path: string;
  type: string;
  createdAt: Date;
  originalName?: string;
  size?: number;
}

@Injectable()
export class FileMetadataService {
  private fileMetadataMap: Map<string, FileMetadata> = new Map();

  /**
   * Store file metadata in memory
   */
  storeMetadata(fileId: string, metadata: FileMetadata): void {
    this.fileMetadataMap.set(fileId, metadata);
  }

  /**
   * Retrieve file metadata by ID
   */
  getMetadata(fileId: string): FileMetadata | undefined {
    return this.fileMetadataMap.get(fileId);
  }

  /**
   * Retrieve file metadata by path
   */
  getMetadataByPath(path: string): FileMetadata | undefined {
    for (const [_, metadata] of this.fileMetadataMap.entries()) {
      if (metadata.path === path) {
        return metadata;
      }
    }
    return undefined;
  }

  /**
   * Remove file metadata from memory
   */
  removeMetadata(fileId: string): boolean {
    return this.fileMetadataMap.delete(fileId);
  }

  /**
   * Clear all metadata (for cleanup purposes)
   */
  clearAll(): void {
    this.fileMetadataMap.clear();
  }

  /**
   * Get all stored metadata
   */
  getAllMetadata(): FileMetadata[] {
    return Array.from(this.fileMetadataMap.values());
  }
}
