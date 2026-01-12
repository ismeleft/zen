import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BreathingExercise } from './BreathingExercise';

describe('BreathingExercise', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should start with idle state', () => {
        render(<BreathingExercise />);
        
        expect(screen.getByText('Start Breathing')).toBeInTheDocument();
        // Updated to match "Ready?" text
        expect(screen.getByText('Ready?')).toBeInTheDocument();
    });

    it('should countdown during inhale phase', () => {
        render(<BreathingExercise />);
        const startBtn = screen.getByText('Start Breathing');
        
        // Use fireEvent for synchronous interactions with fake timers
        fireEvent.click(startBtn);

        // After click, should be Inhale (4 seconds)
        expect(screen.getByText('INHALE')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('Stop')).toBeInTheDocument();

        // Advance 1 second
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should cycle through phases correctly', () => {
        render(<BreathingExercise />);
        
        fireEvent.click(screen.getByText('Start Breathing'));

        // Inhale: 4 (start)
        expect(screen.getByText('INHALE')).toBeInTheDocument();

        // Step 1: 4->3
        act(() => { vi.advanceTimersByTime(1000); });
        expect(screen.getByText('3')).toBeInTheDocument();

        // Step 2: 3->2
        act(() => { vi.advanceTimersByTime(1000); });
        expect(screen.getByText('2')).toBeInTheDocument();

        // Step 3: 2->1
        act(() => { vi.advanceTimersByTime(1000); });
        expect(screen.getByText('1')).toBeInTheDocument();

        // Step 4: 1->0 (Triggers phase change)
        act(() => { vi.advanceTimersByTime(1000); });
        
        // Should be Hold phase now
        expect(screen.getByText('HOLD')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();

        // Advance Hold Duration (7s)
        // Must loop to allow Ref updates between ticks
        for (let i = 0; i < 7; i++) {
            act(() => { vi.advanceTimersByTime(1000); });
        }

        expect(screen.getByText('EXHALE')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should show target cycles input when idle', () => {
        render(<BreathingExercise />);

        const input = screen.getByLabelText(/target cycles/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(5); // Default value
    });

    it('should display current progress during breathing', () => {
        render(<BreathingExercise />);

        fireEvent.click(screen.getByText('Start Breathing'));

        // Should show "1 / 5" initially
        expect(screen.getByText(/1 \/ 5/)).toBeInTheDocument();
    });

    it('should increment cycle count after completing one breath cycle', () => {
        render(<BreathingExercise />);

        fireEvent.click(screen.getByText('Start Breathing'));

        // Complete one full cycle: Inhale (4s) -> Hold (7s) -> Exhale (8s)
        // Total: 4 + 7 + 8 = 19 seconds

        // Complete Inhale (4s)
        for (let i = 0; i < 4; i++) {
            act(() => { vi.advanceTimersByTime(1000); });
        }

        // Complete Hold (7s)
        for (let i = 0; i < 7; i++) {
            act(() => { vi.advanceTimersByTime(1000); });
        }

        // Complete Exhale (8s)
        for (let i = 0; i < 8; i++) {
            act(() => { vi.advanceTimersByTime(1000); });
        }

        // Should now be on cycle 2
        expect(screen.getByText(/2 \/ 5/)).toBeInTheDocument();
        expect(screen.getByText('INHALE')).toBeInTheDocument();
    });

    it('should auto-stop and show completion message after reaching target cycles', () => {
        render(<BreathingExercise />);

        // Set target to 2 cycles for faster test
        const input = screen.getByLabelText(/target cycles/i);
        fireEvent.change(input, { target: { value: '2' } });

        fireEvent.click(screen.getByText('Start Breathing'));

        const completeCycle = () => {
            for (let i = 0; i < 4; i++) act(() => { vi.advanceTimersByTime(1000); });
            for (let i = 0; i < 7; i++) act(() => { vi.advanceTimersByTime(1000); });
            for (let i = 0; i < 8; i++) act(() => { vi.advanceTimersByTime(1000); });
        };

        // Complete cycle 1
        completeCycle();
        expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument();

        // Complete cycle 2
        completeCycle();

        // Should auto-stop and show completion
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
        expect(screen.getByText('Start Breathing')).toBeInTheDocument();
    });

    it('should not show target input during active breathing', () => {
        render(<BreathingExercise />);

        fireEvent.click(screen.getByText('Start Breathing'));

        // Input should not be visible
        expect(screen.queryByLabelText(/target cycles/i)).not.toBeInTheDocument();
    });
});

