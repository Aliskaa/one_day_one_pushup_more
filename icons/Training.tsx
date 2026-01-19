import { useTraining } from '@/contexts/TrainingContext';
import React from 'react';
import SvgPushUp from './Pushup';
import SvgCrunch from './Crunch';

export const SvgTraining = ({ color = "#fff", size = 32 }: { color?: string; size?: number }) => {

    const { trainingType } = useTraining();

    if (trainingType === 'pushup') {
        return <SvgPushUp size={size} color={color} />;
    } else if (trainingType === 'crunch') {
        return <SvgCrunch size={size} color={color} />;
    }

    return <SvgPushUp size={size} color={color} />
}

