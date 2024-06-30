import { useMediaQuery } from "@chakra-ui/react";

// Use 480 as our upper limit for the "mobile" experience.
export default function useMobileBreakpoint(mobileMaxWidth = 480) {
    const mobileMediaQuery = `(max-width: ${mobileMaxWidth}px)`;

    const [isMobile] = useMediaQuery(mobileMediaQuery);

    return isMobile;
}
