import { shareReplay } from "rxjs/operators";

export default function shareLatest() {
  return shareReplay({ refCount: true, bufferSize: 1 });
}
