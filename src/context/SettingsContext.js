import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  newStudentIncome: 2000,
  coeAppliedIncome: 5000,
  coeReceivedIncome: 10000,
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('incomeSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('incomeSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
