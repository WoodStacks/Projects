import { useState, forwardRef, useImperativeHandle, useEffect } from "react";

import { randomArray } from "../Other/Functions";
import type { SortingArrayItem, SortingComponentProps } from "../Other/Types";
import { MAX_VALUE } from "../Other/Defaults";

export type SortingComponentHandle = {
  run: (array: SortingArrayItem[], highestValue: number) => Promise<void>;
};

const SortingComponent = forwardRef<
  SortingComponentHandle,
  SortingComponentProps
>(({ buttonText, maxSize, sortingFunction }, ref) => {
  let randomObj = randomArray(maxSize, MAX_VALUE);

  const [array, setArray] = useState<SortingArrayItem[]>(randomObj.array);
  const [height, setHeight] = useState(randomObj.highestValue);
  const [sorting, setSorting] = useState(false);

  useEffect(() => {
    if (sorting) return;

    randomObj = randomArray(maxSize, MAX_VALUE);
    setArray(randomObj.array);
    setHeight(randomObj.highestValue);
  }, [maxSize]);

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
            randomObj = randomArray(maxSize, MAX_VALUE);
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
