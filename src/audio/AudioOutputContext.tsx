import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { audioContext, audioIsRunning } from './audio';



interface AudioOutputContextProps
{
    isRunning:   boolean;
    toggleAudio: () => void;
}



export const AudioOutputContext = createContext<AudioOutputContextProps | undefined>(undefined);



export const AudioOutputProvider = ({ children }: { children: ReactNode }) =>
{
    const [isRunning, setIsRunning] = useState(false);

    const toggleAudio = useCallback(() => 
    {
        if (audioIsRunning()) audioContext?.suspend().then(() => setIsRunning(audioIsRunning()));
        else                  audioContext?.resume ().then(() => setIsRunning(audioIsRunning()));
    },
    []);

    
    return (
        <AudioOutputContext.Provider value={{ isRunning, toggleAudio }}>
            {children}
        </AudioOutputContext.Provider>
    );
};



export const useAudioOutputContext = () =>
{
    const audioContext = useContext(AudioOutputContext);

    if (audioContext === undefined)
        throw new Error('useAudioContext must be used within an AudioOutputProvider');

    return audioContext;
};