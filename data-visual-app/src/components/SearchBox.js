import { useState } from 'react';

const SearchBox = ({ id, label, placeholder, onChangeText }) => {
  const [enteredText, setEnteredText] = useState('');

  const onUserInput = (e) => {
    setEnteredText(e.target.value);
    onChangeText(e.target.value);
  };

  return (
    <div className='flex justify-center align-center bg-slate-400'>
      <label className='flex items-center justify-center p-2' htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type='text'
        value={enteredText}
        placeholder={placeholder}
        onChange={onUserInput}
      />
    </div>
  );
};

export default SearchBox;
