import { useRef, useState } from "react";

import { randomArray } from "../Other/Functions";
import type { SortingArrayItem } from "../Other/Types";
import { sleep } from "../Other/Functions";
import SortingComponent from "../Components/SortingComponent";
import type { SortingComponentHandle } from "../Components/SortingComponent";
import { MAX_VALUE } from "../Other/Defaults";

async function finalCheck(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
) {
  //Do final check
  for (let i = 0; i < array.length; i++) {
    const arrayItem = array[i];

    if (i === array.length - 1) {
      arrayItem.color = "orange";
    } else {
      const comparingItem = array[i + 1];

      if (arrayItem.value > comparingItem.value) {
        arrayItem.color = "red";
      } else {
        arrayItem.color = "orange";
      }
    }

    setArray([...array]);
    await sleep(50);
  }
}

async function bubbleSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);
  const arr = [...array];
  const speed = 40;

  const lastItem = arr[arr.length - 1];
  lastItem.color = "orange";

  for (let i = 0; i < arr.length; i++) {
    const firstItem = arr[0];
    firstItem.color = "blue";

    setArray([...arr]);
    await sleep(speed);

    const length = arr.length - i - 1;
    for (let j = 0; j < length; j++) {
      const arrayItem2 = arr[j];

      const comparingItem = arr[j + 1];

      if (arrayItem2.value > comparingItem.value) {
        //swap values
        arr[j] = comparingItem;
        arr[j + 1] = arrayItem2;
      } else {
        //if we don't need to swap, just swap colors for visualization
        //only if this isn't orange though
        if (comparingItem.color !== "orange") {
          arrayItem2.color = "red";
          comparingItem.color = "blue";
        } else {
          //if it is orange, array item 2 should now be orange
          arrayItem2.color = "orange";
          comparingItem.color = "blue";
        }
      }

      setArray([...arr]);
      await sleep(speed);
    }
  }

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function selectionSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);
  const arr = [...array];
  const speed = 20;

  for (let i = 0; i < arr.length; i++) {
    let min = i;
    let minArrayItem = arr[min];
    minArrayItem.color = "blue";

    const arrayItem1 = arr[i];
    arrayItem1.color = "orange";

    setArray([...arr]);
    await sleep(speed);

    for (let j = i + 1; j < arr.length; j++) {
      //active item
      let activeArrayItem = arr[j];
      if (activeArrayItem.color !== "orange") {
        activeArrayItem.color = "purple";
      }

      if (j > 0) {
        const prevArrayItem = arr[j - 1];
        if (
          prevArrayItem.color !== "blue" &&
          prevArrayItem.color !== "orange"
        ) {
          prevArrayItem.color = "red";
        }
      }

      setArray([...arr]);
      await sleep(speed);

      if (activeArrayItem.value < minArrayItem.value) {
        min = j;
        if (minArrayItem.color !== "orange") {
          //reset previous min color back to red
          minArrayItem.color = "red";
        }
        minArrayItem = activeArrayItem;
        minArrayItem.color = "blue";
      } else if (j === arr.length - 1) {
        activeArrayItem.color = "red";
      }

      setArray([...arr]);
      await sleep(speed);
    }

    if (min !== i) {
      arr[i] = minArrayItem;
      arr[min] = arrayItem1;
      arrayItem1.color = "red";
    } else {
      minArrayItem.color = "blue";
    }

    setArray([...arr]);
    await sleep(speed);
  }

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function insertionSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);
  const arr = [...array];
  const speed = 40;

  for (let i = 1; i < arr.length; i++) {
    const keyArrayItem = arr[i];
    keyArrayItem.color = "orange";

    setArray([...arr]);
    await sleep(speed);

    let j = i - 1;
    let insertIndexArrayItem = arr[j];

    while (j >= 0 && insertIndexArrayItem.value > keyArrayItem.value) {
      insertIndexArrayItem.color = "blue";
      arr[j + 1] = insertIndexArrayItem;

      //get index item again to reset color
      const newKeyArrayItem = arr[i];
      newKeyArrayItem.color = "orange";

      setArray([...arr]);
      await sleep(speed);

      j--;

      if (j >= 0) {
        insertIndexArrayItem = arr[j];
        insertIndexArrayItem.color = "purple";

        setArray([...arr]);
        await sleep(speed);
      }
    }

    insertIndexArrayItem.color = "blue";

    arr[j + 1] = keyArrayItem;
    keyArrayItem.color = "blue";
    setArray([...arr]);
    await sleep(speed);
  }

  const lastArrayItem = arr[arr.length - 1];
  lastArrayItem.color = "blue";

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function mergeSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);

  // Deep copy to avoid mutating React state objects
  const arr = [...array];
  await mergeSortRecursive(arr, 0, arr.length - 1, setArray);

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function mergeSortRecursive(
  arr: SortingArrayItem[],
  left: number,
  right: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  await mergeSortRecursive(arr, left, mid, setArray);
  await mergeSortRecursive(arr, mid + 1, right, setArray);
  await merge(arr, left, mid, right, setArray);
}

async function merge(
  arr: SortingArrayItem[],
  left: number,
  mid: number,
  right: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
) {
  const speed = 40;
  const leftPart = arr.slice(left, mid + 1).map((b) => ({ ...b }));
  const rightPart = arr.slice(mid + 1, right + 1).map((b) => ({ ...b }));

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftPart.length && j < rightPart.length) {
    leftPart[i].color = "purple";
    rightPart[j].color = "purple";

    setArray([...arr]);
    await sleep(speed);

    if (leftPart[i].value <= rightPart[j].value) {
      arr[k] = leftPart[i++];
    } else {
      arr[k] = rightPart[j++];
    }

    arr[k].color = "orange";
    k++;

    setArray([...arr]);
    await sleep(speed);
  }

  while (i < leftPart.length) {
    arr[k] = leftPart[i++];
    arr[k].color = "orange";
    k++;

    setArray([...arr]);
    await sleep(speed);
  }

  while (j < rightPart.length) {
    arr[k] = rightPart[j++];
    arr[k].color = "orange";
    k++;

    setArray([...arr]);
    await sleep(speed);
  }

  // Reset colors after merge
  for (let idx = left; idx <= right; idx++) {
    arr[idx].color = "blue";
  }

  setArray([...arr]);
}

async function quickSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);

  const arr = array.map((b) => ({ ...b }));
  await quickSortRecursive(arr, 0, arr.length - 1, setArray);

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function quickSortRecursive(
  arr: SortingArrayItem[],
  low: number,
  high: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
) {
  if (low >= high) {
    if (low >= 0 && high >= 0 && low < arr.length) {
      arr[low].color = "blue";
      setArray([...arr]);
    }
    return;
  }

  const speed = 40;

  const pivotIndex = await partition(arr, low, high, speed, setArray);

  // Mark pivot as sorted
  arr[pivotIndex].color = "blue";
  setArray([...arr]);
  await sleep(speed);

  await quickSortRecursive(arr, low, pivotIndex - 1, setArray);
  await quickSortRecursive(arr, pivotIndex + 1, high, setArray);
}

async function partition(
  arr: SortingArrayItem[],
  low: number,
  high: number,
  speed: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
): Promise<number> {
  const pivot = arr[high];
  pivot.color = "orange";

  let i = low - 1;

  setArray([...arr]);
  await sleep(speed);

  for (let j = low; j < high; j++) {
    const arrayItem2 = arr[j];
    arrayItem2.color = "purple";

    setArray([...arr]);
    await sleep(speed);

    if (arrayItem2.value < pivot.value) {
      i++;

      const arrayItem1 = arr[i];

      arrayItem2.color = "red";

      arr[i] = arrayItem2;
      arr[j] = arrayItem1;

      setArray([...arr]);
      await sleep(speed);
    }

    arr[j].color = "red";
  }

  const arrayItem1 = arr[i + 1];
  const highArrayItem = arr[high];

  arr[i + 1] = highArrayItem;
  arr[high] = arrayItem1;

  pivot.color = "red";

  setArray([...arr]);
  await sleep(speed);

  return i + 1;
}

async function heapSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);

  const arr = [...array];
  const speed = 40;
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, setArray, speed);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    arr[i].color = "blue";

    setArray([...arr]);
    await sleep(speed);

    // Restore heap property on reduced heap
    await heapify(arr, i, 0, setArray, speed);
  }

  // Mark remaining root as sorted
  arr[0].color = "blue";
  setArray([...arr]);

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function heapify(
  arr: SortingArrayItem[],
  heapSize: number,
  rootIndex: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  speed: number
) {
  let largest = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  arr[rootIndex].color = "purple";
  setArray([...arr]);
  await sleep(speed);

  if (left < heapSize && arr[left].value > arr[largest].value) {
    largest = left;
  }

  if (right < heapSize && arr[right].value > arr[largest].value) {
    largest = right;
  }

  if (largest !== rootIndex) {
    arr[largest].color = "orange";

    [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
    setArray([...arr]);
    await sleep(speed);

    // Reset color before recursive heapify
    arr[largest].color = "red";

    await heapify(arr, heapSize, largest, setArray, speed);
  }

  arr[rootIndex].color = "red";
}

async function bucketSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);

  // Deep copy to avoid mutating state objects
  const arr = [...array];
  const speed = 60;
  const bucketCount = 5;

  // Create empty buckets
  const buckets: SortingArrayItem[][] = Array.from(
    { length: bucketCount },
    () => []
  );

  const bucketSize = Math.ceil(MAX_VALUE / bucketCount);

  // Distribute elements into buckets
  for (const bar of arr) {
    const bucketIndex = Math.min(
      Math.floor(bar.value / bucketSize),
      bucketCount - 1
    );

    bar.color = "orange";
    buckets[bucketIndex].push(bar);

    setArray([...arr]);
    await sleep(speed);
  }

  // Sort each bucket (insertion sort)
  let writeIndex = 0;

  for (const bucket of buckets) {
    // Insertion sort per bucket
    for (let i = 1; i < bucket.length; i++) {
      const current = bucket[i];
      let j = i - 1;

      while (j >= 0 && bucket[j].value > current.value) {
        bucket[j + 1] = bucket[j];
        j--;
      }

      bucket[j + 1] = current;
    }

    // Write bucket back to main array
    for (const bar of bucket) {
      bar.color = "green";
      arr[writeIndex++] = bar;

      setArray([...arr]);
      await sleep(speed);
    }
  }

  // Mark array as sorted
  for (const bar of arr) {
    bar.color = "blue";
  }

  setArray([...arr]);

  await finalCheck(arr, setArray);

  setSorting(false);
}

async function radixSort(
  array: SortingArrayItem[],
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>,
  setSorting: React.Dispatch<React.SetStateAction<boolean>>
) {
  setSorting(true);

  let arr = [...array];

  const maxDigits = getMaxDigits(arr);

  for (let digit = 0; digit < maxDigits; digit++) {
    await countingSortByDigit(arr, digit, setArray);
  }

  // Mark sorted
  for (const bar of arr) {
    bar.color = "blue";
  }

  setArray([...arr]);

  await finalCheck(arr, setArray);

  setSorting(false);
}

function getMaxDigits(arr: SortingArrayItem[]) {
  let max = 0;
  for (const bar of arr) {
    max = Math.max(max, bar.value);
  }
  return max.toString().length;
}

async function countingSortByDigit(
  arr: SortingArrayItem[],
  digit: number,
  setArray: React.Dispatch<React.SetStateAction<SortingArrayItem[]>>
) {
  const buckets: SortingArrayItem[][] = Array.from({ length: 10 }, () => []);

  const speed = 40;

  // Distribution phase
  for (const bar of arr) {
    const digitValue = Math.floor(bar.value / Math.pow(10, digit)) % 10;
    bar.color = "purple";

    buckets[digitValue].push(bar);

    setArray([...arr]);
    await sleep(speed);

    bar.color = "green";
  }

  // Collection phase
  let index = 0;
  for (const bucket of buckets) {
    for (const bar of bucket) {
      arr[index++] = bar;

      setArray([...arr]);
      await sleep(speed);
    }
  }

  // Reset colors after each digit pass
  for (const bar of arr) {
    bar.color = "red";
  }

  setArray([...arr]);
  await sleep(speed);
}

export default function SortingVisualizer() {
  const childRef1 = useRef<SortingComponentHandle>(null);
  const childRef2 = useRef<SortingComponentHandle>(null);
  const childRef3 = useRef<SortingComponentHandle>(null);
  const childRef4 = useRef<SortingComponentHandle>(null);
  const childRef5 = useRef<SortingComponentHandle>(null);
  const childRef6 = useRef<SortingComponentHandle>(null);
  const childRef7 = useRef<SortingComponentHandle>(null);
  const childRef8 = useRef<SortingComponentHandle>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [maxAmount, setMaxAmount] = useState(50);

  const handleClick = async () => {
    if (isRunning) return;

    setIsRunning(true);

    const randomObj = randomArray(maxAmount, MAX_VALUE);
    const array = randomObj.array;

    // Deep copy to avoid mutating React state objects
    const array1 = array.map((b) => ({ ...b }));
    const array2 = array.map((b) => ({ ...b }));
    const array3 = array.map((b) => ({ ...b }));
    const array4 = array.map((b) => ({ ...b }));
    const array5 = array.map((b) => ({ ...b }));
    const array6 = array.map((b) => ({ ...b }));
    const array7 = array.map((b) => ({ ...b }));
    const array8 = array.map((b) => ({ ...b }));

    try {
      await Promise.all([
        childRef1.current?.run(array1, randomObj.highestValue),
        childRef2.current?.run(array2, randomObj.highestValue),
        childRef3.current?.run(array3, randomObj.highestValue),
        childRef4.current?.run(array4, randomObj.highestValue),
        childRef5.current?.run(array5, randomObj.highestValue),
        childRef6.current?.run(array6, randomObj.highestValue),
        childRef7.current?.run(array7, randomObj.highestValue),
        childRef8.current?.run(array8, randomObj.highestValue),
      ]);
    } catch (err) {
      console.error("One or more child operations failed", err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="mx-auto">Sorting Visualizers</h2>
      <div className="max-w-[1000px] m-auto mt-[20px]">
        This is a collection of sorting visualizers. Each example is
        purposefully slowed down to make it easier to see whats happening with
        color provided to help demonstrate. Click the New Array button on any
        sorting example to do a reset. Click the sorting button to start
        sorting. If you wish to run them all at once, click the Run All Sorts
        button. If they all run at once, they will all receive the same starting
        array, though note the timing is different for each one. Use the slider to adjust the array size.
      </div>
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-[20px] mt-[20px] flex flex-row">
          <button
            className="btn mr-[20px]"
            disabled={isRunning}
            onClick={handleClick}
          >
            Run All Sorts
          </button>

          <label className="mr-[20px]">Array Size:</label>

          <div className="w-[400px]">
            <input
              type="range"
              min={5}
              max="100"
              value={maxAmount}
              className="range w-full"
              step="5"
              onChange={(e) => {
                const value = e.target.value;
                const maxAmount = parseInt(value);
                setMaxAmount(maxAmount);
              }}
            />
            <div className="flex justify-between px-3 mt-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div className="flex justify-between px-3 mt-2 text-xs">
              <span>5</span>
              <span></span>
              <span>15</span>
              <span></span>
              <span>25</span>
              <span></span>
              <span>35</span>
              <span></span>
              <span>45</span>
              <span></span>
              <span>55</span>
              <span></span>
              <span>65</span>
              <span></span>
              <span>75</span>
              <span></span>
              <span>85</span>
              <span></span>
              <span>95</span>
              <span></span>
            </div>
          </div>
        </div>

        <h2>Bubble Sort</h2>
        <div>
          This is a simple sorting algorithm that repeatedly steps through a
          list, compares adjacent elements, and swaps them if they are in the
          wrong order, causing larger elements to "bubble up" to their correct
          positions. The time complexity is O(n²) and is fairly innefficient on
          large lists.
        </div>
        <SortingComponent
          buttonText="Bubble Sort"
          maxSize={maxAmount}
          sortingFunction={bubbleSort}
          ref={childRef1}
        />

        <h2>Selection Sort</h2>
        <div>
          This is a simple, in-place comparison sorting algorithm that works by
          repeatedly finding the minimum element from an unsorted portion of a
          list and placing it at the beginning of a sorted portion. The time
          complexity is O(n²) in the best, average, and worst cases. This makes
          it inefficient for large datasets.
        </div>
        <SortingComponent
          buttonText="Selection Sort"
          maxSize={maxAmount}
          sortingFunction={selectionSort}
          ref={childRef2}
        />

        <h2>Insertion Sort</h2>
        <div>
          This is a simple sorting algorithm that builds a final sorted array
          one element at a time, similar to how one might sort a hand of playing
          cards. It divides the array into a sorted portion and an unsorted
          portion and iteratively inserts elements from the unsorted side into
          their correct position in the sorted side. The average and worst-case
          time complexity is O(n²) (quadratic), making it inefficient for very
          large lists. However, in the best case (when the array is already
          sorted), it runs in O(n) time (linear).
        </div>
        <SortingComponent
          buttonText="Insertion Sort"
          maxSize={maxAmount}
          sortingFunction={insertionSort}
          ref={childRef3}
        />

        <h2>Merge Sort</h2>
        <div>
          This is an efficient, comparison-based sorting algorithm that uses a
          divide-and-conquer approach to sort data. It works by recursively
          breaking down a list into smaller sublists until each sublist contains
          only one element, then merging those sublists back together in sorted
          order. Merge sort has a consistent time complexity of O(n log n) for
          best, average, and worst cases, making it very efficient for large
          datasets.
        </div>
        <SortingComponent
          buttonText="Merge Sort"
          maxSize={maxAmount}
          sortingFunction={mergeSort}
          ref={childRef4}
        />

        <h2>Quick Sort</h2>
        <div>
          This is an efficient, comparison-based divide-and-conquer sorting
          algorithm that partitions a large array into smaller sub-arrays around
          a chosen element called a pivot. It then recursively sorts the
          sub-arrays until the entire list is sorted. Quicksort's average and
          best-case time complexity is O(n log n), making it one of the fastest
          sorting algorithms in practice. Its worst-case time complexity,
          however, is O(n²), which occurs when poor pivot choices consistently
          result in highly unbalanced partitions (e.g., when the array is
          already sorted and the first element is always chosen as the pivot).
        </div>
        <SortingComponent
          buttonText="Quick Sort"
          maxSize={maxAmount}
          sortingFunction={quickSort}
          ref={childRef5}
        />

        <h2>Heap Sort</h2>
        <div>
          This is an efficient, comparison-based sorting algorithm that works by
          using a binary heap data structure. It repeatedly extracts the largest
          (or smallest) element from the heap and places it in its correct
          sorted position in the array. Heap Sort has a consistent time
          complexity of O(n log n) for all cases (best, average, and worst),
          which is a major advantage over algorithms like Quick Sort, whose
          worst case is O(n²).
        </div>
        <SortingComponent
          buttonText="Heap Sort"
          maxSize={maxAmount}
          sortingFunction={heapSort}
          ref={childRef6}
        />

        <h2>Bucket Sort</h2>
        <div>
          This is a sorting algorithm that works by distributing elements of an
          array into a number of smaller, initially empty "buckets". Each bucket
          is then sorted individually, and the sorted buckets are concatenated
          to produce the final sorted array. Bucket sort performs best when the
          input data is uniformly distributed across a known range. In the
          best-case scenario with uniform distribution, it can achieve linear
          time complexity of O(n + k), where 'n' is the number of elements and
          'k' is the number of buckets. The below example has a size of 50 and a
          bucket size of 5 which would make this linear.
        </div>
        <SortingComponent
          buttonText="Bucket Sort"
          maxSize={maxAmount}
          sortingFunction={bucketSort}
          ref={childRef7}
        />

        <h2>Radix Sort</h2>
        <div>
          This is a non-comparative sorting algorithm that sorts data with
          integer keys (or other data that can be broken down into fixed-length
          "digits" like strings) by processing individual digits or characters
          that share the same significant position and value. The time
          complexity of the Radix Sort algorithm is O(d * (n + b)) (or O(n*k) in
          some notations).
        </div>
        <SortingComponent
          buttonText="Radix Sort"
          maxSize={maxAmount}
          sortingFunction={radixSort}
          ref={childRef8}
        />
      </div>
    </div>
  );
}
