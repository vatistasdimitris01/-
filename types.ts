export interface Row {
  id: string;
  supplier: string;
  pallets: number;
  date: string; // YYYY-MM-DD
}

// FIX: Add Tag interface to resolve import error in components/TagComponents.tsx
export interface Tag {
  id: string;
  label: string;
  color: {
    bg: string;
    text: string;
  };
}
