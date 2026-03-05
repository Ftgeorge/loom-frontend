/**
 * BackgroundThread – thin wrapper around LoomThread used at the root layout level.
 * Re-exports as a drop-in replacement so existing imports keep working.
 */

import React from "react";
import { LoomThread } from "./LoomThread";

export default function BackgroundThread() {
    return <LoomThread variant="default" animated opacity={0.4} />;
}
