export type SortingArrayItem = {
  value: number;
  color: string;
};

export interface SortingComponentProps {
  buttonText: string;
  maxSize: number;
  sortingFunction: (
    array: SortingArrayItem[],
    setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
    setSorting: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}
