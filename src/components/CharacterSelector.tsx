import React, { useState, useEffect } from 'react';
import { characters } from '../data/characters';
import { Character } from '../types';

interface CharacterSelectorProps {
  onCharacterSelect: (character: Character) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters.find(c => c.id === 'gandalf') || characters[0]);
  const [showTooltip, setShowTooltip] = useState(false);

  // Set Gandalf as default on component mount
  useEffect(() => {
    const gandalf = characters.find(c => c.id === 'gandalf');
    if (gandalf) {
      setSelectedCharacter(gandalf);
      onCharacterSelect(gandalf);
    }
  }, [onCharacterSelect]);

  const handleCharacterChange = (character: Character) => {
    setSelectedCharacter(character);
    onCharacterSelect(character);
  };

  // Group characters by type
  const disneyCharacters = characters.filter(c => c.type === 'disney');
  const lotrCharacters = characters.filter(c => c.type === 'lotr');

  return (
    <div className="relative">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="mb-2">
          <span className="text-sm font-medium text-yellow-800">Choose Your Companion:</span>
        </div>
        
        <div className="mb-2">
          <p className="text-xs text-yellow-700 mb-1">Cartoon Characters:</p>
          <div className="flex space-x-2">
            {disneyCharacters.map((character) => (
              <button
                key={character.id}
                onClick={() => handleCharacterChange(character)}
                className={`character-selector p-2 rounded-full text-xl transition-all ${
                  selectedCharacter.id === character.id 
                    ? 'bg-yellow-300 shadow-md transform scale-110' 
                    : 'bg-yellow-100 hover:bg-yellow-200'
                }`}
                title={character.description}
              >
                {character.emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs text-yellow-700 mb-1">Lord of the Rings Characters:</p>
          <div className="flex space-x-2">
            {lotrCharacters.map((character) => (
              <button
                key={character.id}
                onClick={() => handleCharacterChange(character)}
                className={`character-selector p-2 rounded-full text-xl transition-all ${
                  selectedCharacter.id === character.id 
                    ? 'bg-yellow-300 shadow-md transform scale-110' 
                    : 'bg-yellow-100 hover:bg-yellow-200'
                }`}
                title={character.description}
              >
                {character.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating character */}
      <div 
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="character-float bg-white rounded-full p-3 shadow-lg border-2 border-yellow-300 text-2xl">
          <span className="text-3xl">{selectedCharacter.emoji}</span>
        </div>
        {showTooltip && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-md border border-yellow-200">
            <strong>{selectedCharacter.name}:</strong> {selectedCharacter.description}
          </div>
        )}
      </div>
    </div>
  );
};