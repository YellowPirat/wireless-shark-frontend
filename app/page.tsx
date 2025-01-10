import {redirect} from 'next/navigation';

export default async function Home() {
    // HARDCODED!
    redirect('/live-view/vcan0');
}