import type { CategoryIcon as CategoryIconName } from "@/lib/categories";
import {
  ArrowUpFromLine,
  Bike,
  Hammer,
  MoveVertical,
  Sparkles,
  SprayCan,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

const icons: Record<CategoryIconName, LucideIcon> = {
  ramp: ArrowUpFromLine,
  diy: Warehouse,
  workshop: Hammer,
  bay: Warehouse,
  spray: SprayCan,
  detail: Sparkles,
  motorcycle: Bike,
  van: Truck,
  lift: MoveVertical,
};

export function CategoryIcon({
  name,
  className = "h-6 w-6",
}: {
  name: CategoryIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} />;
}
