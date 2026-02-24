import React from 'react';
import { Text, View } from 'react-native';

interface StatusStep {
    label: string;
    completed: boolean;
    active: boolean;
}

interface StatusTimelineProps {
    steps: StatusStep[];
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
    return (
        <View className="pl-2">
            {steps.map((step, i) => {
                let dotClass = "w-[22px] h-[22px] rounded-full border-2 items-center justify-center ";
                if (step.completed) {
                    dotClass += "bg-primary/10 border-primary/20";
                } else if (step.active) {
                    dotClass += "border-accent bg-accent/20";
                } else {
                    dotClass += "border-gray-300 bg-white";
                }

                let labelClass = "text-sm ml-4 mt-0.5 ";
                if (step.active) {
                    labelClass += "text-primary font-semibold";
                } else if (step.completed) {
                    labelClass += "text-gray-600 font-medium";
                } else {
                    labelClass += "text-gray-400";
                }

                return (
                    <View key={step.label} className="flex-row items-start min-h-[40px]">
                        <View className="items-center w-7">
                            <View className={dotClass}>
                                {step.completed && <Text className="text-[11px] text-primary font-bold">✓</Text>}
                            </View>
                            {i < steps.length - 1 && (
                                <View
                                    className={`w-[2px] flex-1 min-h-[18px] ${step.completed ? 'bg-primary/10' : 'bg-gray-200'}`}
                                />
                            )}
                        </View>
                        <Text className={labelClass}>
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

export function getJobStatusSteps(status: string): StatusStep[] {
    const allSteps = ['Requested', 'Matched', 'Scheduled', 'In Progress', 'Completed'];
    const statusIndex: Record<string, number> = {
        submitted: 0,
        matched: 1,
        scheduled: 2,
        in_progress: 3,
        completed: 4,
        cancelled: -1,
    };
    const currentIdx = statusIndex[status] ?? 0;
    return allSteps.map((label, i) => ({
        label,
        completed: i < currentIdx,
        active: i === currentIdx,
    }));
}

export function getArtisanJobSteps(status: string): StatusStep[] {
    const allSteps = ['Accepted', 'On My Way', 'In Progress', 'Completed'];
    const statusIndex: Record<string, number> = {
        accepted: 0,
        on_the_way: 1,
        in_progress: 2,
        completed: 3,
        declined: -1,
    };
    const currentIdx = statusIndex[status] ?? 0;
    return allSteps.map((label, i) => ({
        label,
        completed: i < currentIdx,
        active: i === currentIdx,
    }));
}
