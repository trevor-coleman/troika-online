import React, { useRef, useEffect } from 'react';
import './die.css';



interface DieProps {
  dieRoll: number;
  animate?: boolean;
}

const sides = [
  "translateZ(-50px) rotateY(0deg)",
  "translateZ(-50px) rotateX(-180deg)",
  "translateZ(-50px) rotateY(-90deg)",
  "translateZ(-50px) rotateY(90deg)",
  "translateZ(-50px) rotateX(-90deg)",
  "translateZ(-50px) rotateX(90deg)",
];
const Die = ({dieRoll, animate}: DieProps) => {

  const dieRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    rollDie(dieRoll);
  }, [dieRoll])



  function rollDie(roll:number) {

    if (!dieRef.current) return;


    const castRef:HTMLDivElement = dieRef.current;

    if(animate) {
      castRef.classList.add("rolling");

      setTimeout(function () {
        castRef.classList.remove("rolling");
        castRef.style.transform = sides[roll];
      }, 750);
    } else {
      castRef.style.transform = sides[roll];
    }
  }

  return (
      <div className="die-container">
        <div id="die" className={'d' + sides.length} ref={dieRef}>
          {sides.map((side, index) => <div key={`side-${index}`}
                                                className="side">{index +
                                                                  1}</div>)}
        </div>
      </div>);

};

export default Die;
