import { PopoverPosition } from "@material-ui/core";
import { useState } from "react";

const useContextMenu = <T>(initialExtras?: T) => {
    const [state, setState] = useState<{ x?: number, y?: number, extras: T }>({ extras: initialExtras });

    const open = (event: React.MouseEvent, extras?: T) => {
        event.preventDefault();
        event.stopPropagation();
        setState({ x: event.clientX - 2, y: event.clientY - 4, extras });
    }

    const setExtras = (extras: T) => {
        setState({ ...state, extras });
    }

    const close = () => setState(null);

    const isOpen = !!(state?.x && state?.y);
    const position: PopoverPosition = isOpen ? { top: state.y, left: state.x } : undefined;

    return { position, state, isOpen, open, close, setExtras }
}

export default useContextMenu;