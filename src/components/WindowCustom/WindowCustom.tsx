import { type ReactNode, useEffect, useRef } from "react";
import classes from "./WindowCustom.module.css";

//FRAGMENT ******************** PROPS ***********************************
type WindowCustomProps = {
  show: boolean;
  handleClose?: () => void;
  full?: boolean;
  bigger?: boolean;
  extraClassName?: string;
  children?: ReactNode;
};

const WindowCustom = ({
  show,
  handleClose,
  full = false,
  bigger = false,
  extraClassName,
  children,
}: WindowCustomProps) => {
  const hasPadding = full ? "p-0" : "p-6";
  const limit = !bigger ? "md:max-w-2xl" : "";

  const refWindow = useRef<HTMLDivElement>(null);

  window.onclick = function (event) {
    if (event.target === refWindow.current && handleClose) {
      handleClose?.();
    }
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      if (refWindow.current) {
        const windowElement = refWindow.current;
        const focusableElements = windowElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKeyPress = (event: KeyboardEvent) => {
          if (event.key === "Tab") {
            if (event.shiftKey && document.activeElement === firstElement) {
              event.preventDefault();
              (lastElement as HTMLButtonElement).focus();
            } else if (
              !event.shiftKey &&
              document.activeElement === lastElement
            ) {
              event.preventDefault();
              (firstElement as HTMLButtonElement).focus();
            }
          }
        };
        windowElement.addEventListener("keydown", handleTabKeyPress);
        return () => {
          windowElement.removeEventListener("keydown", handleTabKeyPress);
        };
      }
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return show ? (
    <div ref={refWindow} className={`${classes.window} flex`}>
      <section
        className={`container ${limit} ${classes.windowContent} ${hasPadding} ${
          extraClassName ? extraClassName : ""
        }`}
      >
        {handleClose && (
          <button
            type="button"
            className={classes.close}
            onClick={() => handleClose?.()}
          >
            x
          </button>
        )}
        <br />
        {children && children}
      </section>
    </div>
  ) : (
    <></>
  );
};

export default WindowCustom;
