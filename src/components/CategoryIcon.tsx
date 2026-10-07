import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Laptop,
  Home,
  Gift,
  ShoppingCart,
  Zap,
  Car,
  Utensils,
  Activity,
  BookOpen,
  Heart,
  Smartphone,
  Wrench,
  Tag,
  DollarSign,
  Coffee,
  Plane,
  Shield,
  Film,
  Smile,
  LucideProps,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Briefcase,
  TrendingUp,
  Laptop,
  Home,
  Gift,
  ShoppingCart,
  Zap,
  Car,
  Utensils,
  Activity,
  BookOpen,
  Heart,
  Smartphone,
  Wrench,
  Tag,
  DollarSign,
  Coffee,
  Plane,
  Shield,
  Film,
  Smile,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name] || Tag;
  return <IconComponent {...props} />;
};
