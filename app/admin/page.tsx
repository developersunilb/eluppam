
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                audioChunksRef.current = [];
                saveRecording(audioBlob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playRecording = () => {
        const audio = new Audio(audioURL);
        audio.play();
    };

    const saveRecording = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, `recorded_audio_${new Date().toISOString()}.mp3`);

        try {
            const response = await fetch('/api/save-audio', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert('File saved successfully!');
            } else {
                alert('Error saving file: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving audio file:', error);
            alert('Error saving audio file');
        }
    };

    useEffect(() => {
        const adminStatus = sessionStorage.getItem('isAdmin');
        if (adminStatus !== 'true') {
            router.push('/admin/login');
        } else {
            setIsAdmin(true);
        }
    }, [router]);

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Tools</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-2xl font-semibold">Voice Recorder</h2>
                        <div className="flex items-center gap-4">
                            <Button onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "destructive" : "default"}>
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </Button>
                            <Button onClick={playRecording} disabled={!audioURL}>Play</Button>
                        </div>
                        {audioURL && (
                            <audio src={audioURL} controls className="w-full mt-4" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
