import {useEffect, useState} from 'react';

const UseDebounce = (value, delay) => {
  const [debounceVal, setDebounceVal] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  });

  if (debounceVal) {
    return debounceVal;
  }
};
export default UseDebounce;
