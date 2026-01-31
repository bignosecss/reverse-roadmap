import type { RrNode } from '@repo/shared';
import type { StatusCounts } from '../types';

export class StatusCounter {
  countByStatus(nodes: RrNode[]): StatusCounts {
    const counts: StatusCounts = {
      completed: 0,
      deprecated: 0,
      inProgress: 0,
      notStarted: 0,
      blocked: 0,
      review: 0,
      cancelled: 0,
      active: 0,
    };

    for (const node of nodes) {
      const status = node.status?.toLowerCase();

      switch (status) {
        case 'completed':
          counts.completed++;
          break;
        case 'deprecated':
          counts.deprecated++;
          break;
        case 'in-progress':
          counts.inProgress++;
          break;
        case 'not-started':
          counts.notStarted++;
          break;
        case 'blocked':
          counts.blocked++;
          break;
        case 'review':
          counts.review++;
          break;
        case 'cancelled':
          counts.cancelled++;
          break;
        case 'active':
          counts.active++;
          break;
        default:
          // Handle nodes without explicit status
          counts.active++;
      }
    }

    return counts;
  }
}
