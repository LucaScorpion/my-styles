import { useCallback, useEffect, useState } from 'react';
import { Stylesheet } from 'types/dist/Stylesheet';
import { StorageChange } from 'types/dist/StorageChange';
import { getSyncStorage, setSyncStorage } from 'types/dist/storage';

export function useStylesheets(): [Stylesheet[], (newValue: Stylesheet[]) => void] {
  const [stylesheets, setStylesState] = useState<Stylesheet[]>([]);

  useEffect(() => {
    function changeListener(changes: Record<string, StorageChange<Stylesheet[]>>, areaName: string) {
      if (areaName === 'sync' && changes.stylesheets) {
        setStylesState(changes.stylesheets.newValue || []);
      }
    }

    browser.storage.onChanged.addListener(changeListener);
    return () => browser.storage.onChanged.removeListener(changeListener);
  }, []);

  useEffect(() => {
    getSyncStorage('stylesheets').then((s) => setStylesState(s.stylesheets || []));
  });

  const setStyles = useCallback((newStylesheets: Stylesheet[]) => {
    setSyncStorage({ stylesheets: newStylesheets });
  }, []);

  return [stylesheets, setStyles];
}
