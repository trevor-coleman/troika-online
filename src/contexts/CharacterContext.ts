import React from 'react';

export const CharacterContext = React.createContext<{character: string, editable?: boolean}>({character: "", editable: false});
