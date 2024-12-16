import DBCControl from './DBCControl'
import GridControl from './GridControl'

export default function Sidebar() {
    return (
        <div className="w-64 border-r bg-gray-50 p-4">
            <DBCControl/>
            <GridControl/>
        </div>
    )
}