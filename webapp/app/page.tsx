"use client"

import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import loading from "../spinner.gif"
import Image from "next/image";

interface InputProps {
    placeholder : string
    value? : string  
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface InformationPopupProps {
    content : string
}

export function InformationPopup({content} : InformationPopupProps) {
    const [opacity, setOpacity] = useState(0); // State to control opacity

    return (
        <div className="relative z-10">
          
                <IoMdInformationCircleOutline 
                onMouseEnter={() => setOpacity(1)} // Set opacity to 1 on mouse enter
                onMouseLeave={() => {
                    setOpacity(0); // Set opacity to 0 with delay

                }}
                className="cursor-pointer"
                size={24} />
            <div
                className={`absolute bg-black text-white z-10 p-2 rounded-lg transition-opacity duration-500 ${
                    opacity ? 'opacity-100' : 'opacity-0'
                } pointer-events-none max-w-xs w-auto`}
                style={{ transitionDelay: `${opacity ? '0ms' : '1000ms'}` }}
            >
                {content}
            </div>
        </div>
    );
}

export function Input({placeholder, value, onChange} : InputProps) {
  
  if (value != undefined) {
      return <textarea
      className="m-5 p-10 border-4 border-white rounded-lg cursor-not-allowed placeholder-stone-500 text-2xl text-black"
      placeholder={placeholder}
      value={value}
      disabled={true}
      ></textarea>
  } else {
    return <textarea
      className="m-5 p-10 border-4 border-white rounded-lg placeholder-stone-500 text-2xl text-black"
      placeholder={placeholder}
      onChange={onChange} 
      ></textarea>

  }


}

export default function Home() {
  const [renderedTranslation, setRenderedTranslation] = useState("");
  const [query, setQuery] = useState("");

  async function fetchData() {

    try {
      console.log("http://0.0.0.0:8000/" + model + "/" + query)
      setIsLoading(true);
      const response = await fetch("http://0.0.0.0:8000/" + model + "/" + query);
      const responseData = await response.json();
      setIsLoading(false);
      setRenderedTranslation(responseData.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  } 

  const [model, setModel] = useState('');
  const [score, setScores] = useState("Select a model!");
  const [isloading, setIsLoading] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
    setRenderedTranslation("");
    console.log(renderedTranslation);
  };

  useEffect(() => {
    const modelToScore = {
      "bart-kde4" : "",
      "bart-iswlt2017" : "",
      "marian-kde4" : "BLEU : 47.283",
      "marian-iswlt2017" : "BLEU : 40.884",
      "T5-kde4" : "BLEU : 43.718",
      "T5-iswlt2017" : "BLEU : 35.586",
      "delight" : "BLEU : 32.114"
    }

    //@ts-ignore
    setScores(modelToScore[model])

  }, [model])


  return (
     <>
        <div className="text-4xl text-center font-bold m-10 drop-shadow-lg text-white bg-sky-500 p-4 rounded-lg">
          Machine Translation
        </div>

        <div className="m-5 flex flex-col lg:grid lg:grid-cols-2">
          <Input 
            placeholder="Type English..."
            onChange={(e) => {setQuery(e.target.value)}}
          />
          <Input 
            placeholder="French Translation..."
            value={renderedTranslation}
          />
          
        </div>
        <div className="m-32 mt-0 mb-4">
          <div className="flex items-center  justify-center">

              <FormControl fullWidth className="mr-4">
                <InputLabel id="demo-simple-select-label">Select Model</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={model}
                label="Models"
                onChange={handleChange}
              >
                <MenuItem value={"marian-kde4"}>Marian (KDe4)</MenuItem>
                <MenuItem value={"marian-iswlt2017"}>Marian (iswlt2017) </MenuItem>
                <MenuItem value={"T5-kde4"}>T5 (KDe4) </MenuItem>
                <MenuItem value={"T5-iswlt2017"}>T5 (iswlt2017) </MenuItem>
                <MenuItem value={"bart-iswlt2017"}>Bart (iswlt2017) </MenuItem>
                <MenuItem value={"bart-kde4"}>Bart (kde4) </MenuItem>
                <MenuItem value={"delight"}>Delight</MenuItem>
  
              </Select>
            </FormControl>
            <InformationPopup 
              content={score}
            
            />
      </div>
</div>

        <div className="flex items-center justify-center">
        {isloading && <div className="m-5">Loading...</div>}
        </div>
        
        <div className="flex items-center font-bold justify-center">
          <button 
            onClick={fetchData}
            className="bg-sky-500 transition hover:scale-105 px-10 py-3 text-white rounded-lg">
            Translate
          </button>
        </div>
     
     </>
  );
}
