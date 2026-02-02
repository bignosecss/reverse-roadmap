import { RrRootStatus } from "./enums";

export interface RrRoot {
  _id: string;
  title: string;
  rootRrNode: string;
  status: RrRootStatus;
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
