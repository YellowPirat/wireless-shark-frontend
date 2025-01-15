import {EnhancedCanMessage} from '@/components/CANParser/CANParser';

interface SignalsWidgetProps {
    message: EnhancedCanMessage | undefined;
}

export default function SignalsWidget({message}: SignalsWidgetProps) {
    return (
        <div className="space-y-1 pl-4 pt-2">
            {message ?
                message.signals.map((signal, index) => {
                    return (
                        <div key={index} className="text-sm">
                            <span className="font-medium">{signal.name}:</span>{' '}
                            {signal.value.toFixed(2)} {signal.unit}
                        </div>
                    );
                })
                : <span className="text-gray-500">Not yet received</span>}
        </div>
    )
}