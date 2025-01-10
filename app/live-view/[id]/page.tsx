import LiveView from '@/components/LiveView'

export default async function Home({
                                 params,
                             }: {
    params: Promise<{ id: string }>
}) {
    return <LiveView canSocket={(await params).id}/>
}

export async function generateStaticParams() {
    return [
        { id: 'vcan0' },
        { id: 'vcan1' },
        { id: 'vcan2' },
        { id: 'vcan3' },
        { id: 'vcan4' },
        { id: 'vcan5' }
    ]
}