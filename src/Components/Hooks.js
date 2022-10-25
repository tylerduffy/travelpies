import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {

    const canvasRef = useRef(null);
    const prevPointRef = useRef(null);
    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    const touchMoveListenerRef = useRef(null);
    const touchEndListenerRef = useRef(null);

    useEffect(() => {

        // mouse listeners
        function initMouseMoveListener() {
            //if (!canvasRef.current) return;
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY);
                    const ctx = canvasRef.current.getContext('2d');
                    if (onDraw) onDraw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;
                    console.log(point);
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }
    
        function initMouseUpListener() {
            if (!canvasRef.current) return;
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }
            mouseUpListenerRef.current = listener;
            window.addEventListener("mouseup", listener);
        }

        // touch listeners
        function initTouchMoveListener() {
            //if (!canvasRef.current) return;
            const touchMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const point = computePointInCanvas(e.touches[0].clientX, e.touches[0].clientY);
                    const ctx = canvasRef.current.getContext('2d');
                    if (onDraw) onDraw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;
                    console.log(point);
                }
            }
            touchMoveListenerRef.current = touchMoveListener;
            window.addEventListener("touchmove", touchMoveListener, false);
        }
    
        function initTouchEndListener() {
            if (!canvasRef.current) return;
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }
            touchEndListenerRef.current = listener;
            window.addEventListener("touchend", listener, false);
        }

        function computePointInCanvas(clientX, clientY) {
            if (canvasRef.current) {
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                }
            } else {
                return null;
            }
        }

        function removeListeners() {
            // mouse listeners
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
            }

            // touch listeners
            if (touchMoveListenerRef.current) {
                window.removeEventListener("touchmove", touchMoveListenerRef.current);
            }
            if (touchEndListenerRef.current) {
                window.removeEventListener("touchend", touchEndListenerRef.current);
            }
        }

        initMouseMoveListener();
        initMouseUpListener();

        initTouchMoveListener();
        initTouchEndListener();

        return () => {
            // TODO: clean up!!!
            removeListeners();
        };

    }, [onDraw]); // whenever the onDraw function changes, re-evaluate this effect because onDraw is a dependency

    function setCanvasRef(ref) {
        canvasRef.current = ref;
    }

    function onMouseDown() {
        isDrawingRef.current = true;
    }

    function onTouchStart() {
        isDrawingRef.current = true;
    }

    return {
        setCanvasRef,
        onMouseDown,
        onTouchStart
    }

}