import Sidebar from './Sidebar'
import GridView from './GridView'

export default function LiveView() {
    return (
        <div className="flex h-[calc(100vh-64px)]">
            <Sidebar />
            <GridView />
        </div>
    )
}