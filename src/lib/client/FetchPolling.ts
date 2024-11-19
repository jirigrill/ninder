export function poll<T>(
    pollingFunction: () => Promise<T>,
    condition: (result: T) => boolean,
    onConditionMet: (result: T) => void,
    pollingRate: number = 5000
) {
    let pollingInterval: NodeJS.Timeout | null = null;

    async function checkCondition() {
        try {
            const result = await pollingFunction();
            if (condition(result)) {
                stopPolling();
                onConditionMet(result);
            }
        } catch (error) {
            console.error('Failed to poll:', error);
        }
    }

    function startPolling() {
        pollingInterval = setInterval(checkCondition, pollingRate);
        checkCondition();
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }

    startPolling();

    return {
        stop: stopPolling
    };
}