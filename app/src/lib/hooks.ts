import { useEffect, useState, useRef } from "react";
import { helper } from "./helper";
import { BlinkoStore } from "@/store/blinkoStore";
import { RootStore } from "@/store";
import { isAndroid, isInTauri } from '@/lib/tauriHelper';
import { ShowEditBlinkoModel } from '@/components/BlinkoRightClickMenu';
import { eventBus } from '@/lib/event';

import { readFile } from "@tauri-apps/plugin-fs";
import { FocusEditorFixMobile } from "@/components/Common/Editor/editorUtils";

export const useConfigSetting = (configKey: keyof BlinkoStore['config']['value']) => {
  const blinko = RootStore.Get(BlinkoStore);

  const store = RootStore.Local(() => ({
    value: '',
    isVisible: false,
    setValue(newValue: string) {
      this.value = newValue;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    }
  }));

  useEffect(() => {
    if (blinko.config.value && blinko.config.value[configKey]) {
      store.setValue(blinko.config.value[configKey] as string);
    }
  }, [blinko.config.value, configKey]);

  return {
    value: store.value,
    isVisible: store.isVisible,
    setValue: store.setValue,
    toggleVisibility: store.toggleVisibility
  };
};


export const useSwiper = (threshold = 50) => {
  const [isVisible, setIsVisible] = useState(true);
  const touchStartY = useRef(0);
  const lastDirection = useRef<'up' | 'down'>();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY || 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0]?.clientY || 0;
      const deltaY = touchY - touchStartY.current;

      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          lastDirection.current = 'down';
          setIsVisible(true);
        } else {
          lastDirection.current = 'up';
          setIsVisible(false);
        }
        touchStartY.current = touchY;
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [threshold]);

  return isVisible;
};


export const handlePaste = (event) => {
  //@ts-ignore
  const clipboardData = event.clipboardData || window.clipboardData;
  const items = clipboardData.items;
  let files = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file") {
      const file = items[i].getAsFile();
      //@ts-ignore
      files.push(file);
    }
  }

  if (files.length > 0) {
    return files
  }
};


export const usePasteFile = (targetRef) => {
  const [pastedFiles, setPastedFiles] = useState([]);

  useEffect(() => {


    const targetElement = targetRef.current;

    if (targetElement) {
      targetElement.addEventListener("paste", handlePaste);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener("paste", handlePaste);
      }
    };
  }, [targetRef]);

  return pastedFiles;
};


interface HistoryBackProps<T extends string> {
  state: boolean;
  onStateChange: () => void;
  historyState: T;
}

export const useHistoryBack = <T extends string>({
  state,
  onStateChange,
  historyState
}: HistoryBackProps<T>) => {
  useEffect(() => {
    if (state) {
      try {
        const currentPath = window.location.pathname + window.location.search;
        history.pushState({
          [historyState]: true,
          timestamp: Date.now(),
          path: currentPath
        }, '', currentPath);
      } catch (error) {
        console.warn('History pushState failed:', error);
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      if (state && event?.state) {
        onStateChange();
      }
    };

    try {
      window.addEventListener('popstate', handlePopState);
    } catch (error) {
      console.warn('Failed to add popstate listener:', error);
    }

    return () => {
      try {
        window.removeEventListener('popstate', handlePopState);
      } catch (error) {
        console.warn('Failed to remove popstate listener:', error);
      }
    };
  }, [state, onStateChange, historyState]);
};

export const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    setIsIOS(helper.env.isIOS());
  }, []);
  return isIOS;
};

export const useAndroidShortcuts = () => {
  useEffect(() => {
    if (!isAndroid() || !isInTauri()) {
      return;
    }

    // Handle shortcuts
    const action = window.localStorage.getItem('android_shortcut_action');
    if (action) {
      window.localStorage.removeItem('android_shortcut_action');
      switch (action) {
        case 'quick_note':
          ShowEditBlinkoModel('2xl', 'create');
          FocusEditorFixMobile()
          break;

        case 'voice_recording':
          ShowEditBlinkoModel('2xl', 'create');
          // Use eventBus to trigger audio recording after editor is ready
          setTimeout(() => {
            eventBus.emit('editor:startAudioRecording');
          }, 800);
          break;
      }
    }

    // Handle shared data
    const shareDataStr = window.localStorage.getItem('android_share_data');
    if (shareDataStr) {
      // alert(shareDataStr)
      window.localStorage.removeItem('android_share_data');
      try {
        const shareData = JSON.parse(shareDataStr);
        if (shareData.text) {
          // Remove surrounding quotes (single, double, backticks) and trim whitespace
          let cleanText = shareData.text.trim();
          if ((cleanText.startsWith('"') && cleanText.endsWith('"')) ||
              (cleanText.startsWith("'") && cleanText.endsWith("'")) ||
              (cleanText.startsWith('`') && cleanText.endsWith('`'))) {
            cleanText = cleanText.slice(1, -1);
          }
          ShowEditBlinkoModel('2xl', 'create', { text: cleanText });
        }
        else if (shareData.stream && shareData.content_type) {
          readFile(shareData.stream).then(contents => {
            const file = new File([contents], shareData.name || 'shared_file', {
              type: shareData.content_type
            });
            console.log('xxx!!!')
            ShowEditBlinkoModel('2xl', 'create', { file });
          }).catch((error: Error) => {
            console.warn('fetching shared content failed:', error);
            ShowEditBlinkoModel('2xl', 'create');
          });
        }
        else {
          ShowEditBlinkoModel('2xl', 'create');
        }
      } catch (e) {
        console.error('Failed to parse share data:', e);
        // Fallback: just open create modal
        ShowEditBlinkoModel('2xl', 'create');
      }
    }
  }, []);
};



