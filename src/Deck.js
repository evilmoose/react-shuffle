import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
/** Deck: uses deck API, allows drawing card at a time. */

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeckFromAPI() {
    const fetchData = async () => {
      const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    fetchData();
  }, []);



  /** Draw card: change the state & effect will kick in. */
  const draw = async () => {
    try {
      const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

      if (drawRes.data.remaining === 0) throw new Error("Deck empty!");

      const card = drawRes.data.cards[0];

      setDrawn(d => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }

  /** Shuffle: change the state & effect will kick in. */
  const startShuffling = async () => {
    setIsShuffling(true);
    try {
      await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
    } catch (err) {
      alert(err);
    } finally {
      setIsShuffling(false);
    }
  }

  /** Return draw button (disabled if shuffling) */
  const renderDrawBtnIfOk = async () => {
    if (!deck) return null;

    return (
      <button
        className="Deck-gimme"
        onClick={draw}
        disabled={isShuffling}>
        DRAW
      </button>
    );
  }

  /** Return shuffle button (disabled if already is) */
  const renderShuffleBtnIfOk = () => {
    if (!deck) return null;
    return (
      <button
        className="Deck-gimme"
        onClick={startShuffling}
        disabled={isShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">

      {renderDrawBtnIfOk()}
      {renderShuffleBtnIfOk()}

      <div className="Deck-cardarea">{
        drawn.map(c => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>

    </main>
  );
}

export default Deck;