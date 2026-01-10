import { useState, forwardRef, useImperativeHandle } from "react";

import { randomArray } from "../Other/Functions";
import type { SortingArrayItem, SortingComponentProps } from "../Other/Types";

const ARRAY_SIZE = 50;
const MAX_VALUE = 300;

export type SortingComponentHandle = {
  run: (array: SortingArrayItem[], highestValue: number) => Promise<void>;
};

const SortingComponent = forwardRef<
  SortingComponentHandle,
  SortingComponentProps
>(({ buttonText, sortingFunction }, ref) => {
  let randomObj = randomArray(ARRAY_SIZE, MAX_VALUE);

  const [array, setArray] = useState<SortingArrayItem[]>(randomObj.array);
  const [height, setHeight] = useState(randomObj.highestValue);
  const [sorting, setSorting] = useState(false);

  useImperativeHandle(ref, () => ({
    async run(array, highestValue) {

      setArray(array);
      setHeight(highestValue);

      await sortingFunction(array, setArray, setSorting);
    },
  }));

  return (
    <>
      <div className="mt-[20px]">
        <button
          className="btn mr-[20px]"
          onClick={() => {
            randomObj = randomArray(ARRAY_SIZE, MAX_VALUE);
            setArray(randomObj.array);
            setHeight(randomObj.highestValue);
          }}
          disabled={sorting}
        >
          New Array
        </button>
        <button
          className="btn"
          onClick={() => sortingFunction(array, setArray, setSorting)}
          disabled={sorting}
        >
          {buttonText}
        </button>
      </div>

      <div
        className="flex items-end gap-[2px] mt-[20px] mb-[20px]"
        style={{
          height: height,
        }}
      >
        {array.map((item, idx) => (
          <div
            key={idx}
            className="w-[20px]"
            style={{
              height: item.value,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>
    </>
  );
});

export default SortingComponent;
