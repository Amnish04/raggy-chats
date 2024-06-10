import { Textarea, TextareaProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import ResizeTextarea from "react-textarea-autosize";

const AutoResizingTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    return (
        <Textarea
            minH="unset"
            overflow="hidden"
            w="100%"
            maxH="10vh"
            resize="none"
            ref={ref}
            minRows={1}
            as={ResizeTextarea}
            {...props}
        />
    );
});

export default AutoResizingTextarea;
