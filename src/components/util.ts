import { ConnectionType } from '../nodes/connections';
import { getSelectedWireColor, getWireColor } from '../nodes/util';

export function getWireColors(sourceHandleId: string, targetHandleId: string) {
    const sourceHandle = document.querySelector(
        `[data-handleid="${sourceHandleId}"]`
    ) as HTMLElement;

    const targetHandle = document.querySelector(
        `[data-handleid="${targetHandleId}"]`
    ) as HTMLElement;

    const sourceType = sourceHandle?.dataset.handletype;
    const targetType = targetHandle?.dataset.handletype;

    return {
        wireColor: getWireColor((sourceType ?? targetType) as ConnectionType),
        selectedColor: getSelectedWireColor((sourceType ?? targetType) as ConnectionType),
    };
}
