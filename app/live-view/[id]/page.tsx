import LiveView from '@/components/LiveView'

export default function Page({
                                 params,
                             }: {
    params: { id: string }
}) {
    return <LiveView canSocket={params.id}/>
}

export async function generateStaticParams() {
    const response = await fetch("http://localhost:8080/assignments"); // JSON mit CAN-Sockets abrufen
    const jsonData = await response.json();
    return jsonData.map((item: any) => ({ id: item.CANSocket }));
}
