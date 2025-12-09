import { RrRootStatus } from "./enums.js";

export interface RrRoot {
  _id: string;
  title: string;
  rootRrNode: string;
  status: RrRootStatus;
  createdAt: Date;
  updatedAt: Date;
}
