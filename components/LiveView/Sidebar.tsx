import { Card } from '@/components/ui/card'
import DBCControl from './DBCControl'
import GridControl from './GridControl'

export default function Sidebar() {
    return (
        <div className="w-64 border-r bg-gray-50 p-4">
            <Card className="mb-4 p-4">
                <h3 className="text-lg font-semibold mb-2">DBC Control</h3>
                <DBCControl />
            </Card>

            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Grid Control</h3>
                <GridControl />
            </Card>
        </div>
    )
}