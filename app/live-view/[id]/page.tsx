import LiveView from '@/components/LiveView'

export default async function Home({
                                 params,
                             }: {
    params: Promise<{ id: string }>
}) {
    return <LiveView canSocket={(await params).id}/>
}

export async function generateStaticParams() {
    //HARDCODED!
    return [
        { id: 'can0' },
        { id: 'can1' },
        { id: 'can2' },
        { id: 'can3' },
        { id: 'can4' },
        { id: 'can5' }
    ]
}