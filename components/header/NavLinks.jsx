import { memo } from "react";
import {
    WavyDrawMark,
    CircleDrawMark,
    TagFrameMark,
    HighlightSweepMark,
    SpeechBubbleMark,
} from "@/components/ui/TextMarks";

const MARKS = {
    wavy: WavyDrawMark,
    circle: CircleDrawMark,
    tag: TagFrameMark,
    highlight: HighlightSweepMark,
    speech: SpeechBubbleMark,
};

function markProps(markKey, isRTL) {
    if (markKey === "tag") return { holeSide: isRTL ? "end" : "start" };
    if (markKey === "highlight") return { sweepFrom: isRTL ? "end" : "start" };
    return {};
}

function NavLink({ item, label, isRTL, onNavigate }) {
    const Mark = MARKS[item.markKey];
    return (
        <a href={item.href} onClick={onNavigate} className={item.className}>
            <Mark {...markProps(item.markKey, isRTL)}>{label}</Mark>
        </a>
    );
}

export default memo(NavLink);