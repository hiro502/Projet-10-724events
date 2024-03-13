import { useEffect, useState, useCallback } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";


import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
  new Date(evtA.date) - new Date(evtB.date)); // Trier les événements par ordre 
  let intervalId;

  useEffect(() => {
    if (byDateDesc) {
      clearInterval(intervalId); 
      intervalId = setInterval(() => {
        setIndex(prevIndex => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
      }, 5000);  // Modifié pour　ne pas affichier d'une page blanche
    }
  
    return () => clearInterval(intervalId);
  }, [byDateDesc]); 
  

  const handleIndexChange = useCallback((radioIdx) => {
    clearInterval(intervalId);
    setIndex(radioIdx);
    setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex(prevIndex => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
      }, 5000);
    }); 
  }, [byDateDesc]);  // Ajout de la fonctionnalité permettant à l'utilisateur de choisir une photo à volonté
  

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
          <div
            key={event.id} 
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>  
      ))}
       <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc?.map((event, radioIdx) => (
                <input
                  key={event.id}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  onChange={() => handleIndexChange(radioIdx)}
                />
              ))}
            </div>
          </div>
    </div>
  );
};

export default Slider;