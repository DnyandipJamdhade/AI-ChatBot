/**
 * Attendance Calculation Utility for Attendance Information Assistant
 * SNJB KBJ COE Chandwad
 * Created by: Dnyandip
 *
 * Deterministic mathematical calculations adhering strictly to:
 * x = max(0, ceil((p * T - A) / (1 - p)))
 */

export interface AttendanceCalculationResult {
  attended: number;
  totalConducted: number;
  percentage: number;
  missed: number;
  targetPercentage: number;
  isEligible: boolean; // >= targetPercentage
  status: 'safe' | 'warning' | 'critical';
  statusLabel: string;
  consecutiveNeeded: number;
  isHundredPercentImpossible: boolean;
  allowableFutureAbsences: number; // How many can be skipped consecutively right now without falling below target
  futureSimulation?: {
    remainingClasses: number;
    mustAttend: number;
    canMiss: number;
    projectedFinalPercentage: number;
  };
  formulaExplanation: {
    formula: string;
    steps: string[];
  };
}

/**
 * Calculates attendance metrics with rigorous input validation
 */
export function calculateAttendance(
  attended: number,
  totalConducted: number,
  targetPercentage: number = 75
): AttendanceCalculationResult {
  // Input sanitation
  const A = Math.max(0, Math.floor(attended || 0));
  const T = Math.max(0, Math.floor(totalConducted || 0));
  const target = Math.min(100, Math.max(1, targetPercentage || 75));
  const p = target / 100;

  // Edge case: No classes conducted yet
  if (T === 0) {
    return {
      attended: 0,
      totalConducted: 0,
      percentage: 100, // By academic convention, 0/0 is considered 100% or not yet evaluated
      missed: 0,
      targetPercentage: target,
      isEligible: true,
      status: 'safe',
      statusLabel: 'No classes conducted yet',
      consecutiveNeeded: 0,
      isHundredPercentImpossible: false,
      allowableFutureAbsences: 0,
      formulaExplanation: {
        formula: 'Attendance % = (Attended / Total) × 100',
        steps: ['No lectures have been scheduled or conducted yet.'],
      },
    };
  }

  // Edge case: Attended cannot exceed total conducted
  const safeA = Math.min(A, T);
  const missed = T - safeA;
  const currentPercentage = Number(((safeA / T) * 100).toFixed(2));
  const isEligible = currentPercentage >= target;

  // Status classification according to SPPU / SNJB Academic Norms:
  // Safe: >= target (typically >= 75%)
  // Warning: 65% to <75% (Medical condonation band)
  // Critical: < 65% (Strict Defaulter / Detention risk)
  let status: 'safe' | 'warning' | 'critical' = 'safe';
  let statusLabel = 'Safe (Above Target)';
  if (currentPercentage < 65) {
    status = 'critical';
    statusLabel = 'Critical Defaulter (Below 65%)';
  } else if (currentPercentage < target) {
    status = 'warning';
    statusLabel = 'Shortage Warning (Condonation Band)';
  }

  // 100% Target Special Handling:
  // If target is 100% and student has missed even 1 class (safeA < T),
  // (safeA + x)/(T + x) < 1 for all finite x. It can never reach 100.0%.
  let isHundredPercentImpossible = false;
  let consecutiveNeeded = 0;

  if (target === 100) {
    if (safeA < T) {
      isHundredPercentImpossible = true;
      consecutiveNeeded = -1; // Flag as impossible
    } else {
      consecutiveNeeded = 0;
    }
  } else {
    // Formula: x = max(0, ceil((p * T - A) / (1 - p)))
    const numerator = p * T - safeA;
    const denominator = 1 - p;
    if (numerator <= 0) {
      consecutiveNeeded = 0;
    } else {
      consecutiveNeeded = Math.max(0, Math.ceil(numerator / denominator));
    }
  }

  // Allowable future absences:
  // If currently >= target, how many future lectures can be missed without falling below target?
  // safeA / (T + y) >= p  =>  T + y <= safeA / p  =>  y <= (safeA - p * T) / p
  let allowableFutureAbsences = 0;
  if (currentPercentage >= target && p > 0) {
    const rawCushion = Math.floor((safeA - p * T) / p);
    allowableFutureAbsences = Math.max(0, rawCushion);
  }

  // Step-by-step formula explanations
  const steps: string[] = [];
  steps.push(`Current Percentage = (${safeA} ÷ ${T}) × 100 = ${currentPercentage}%`);
  steps.push(`Classes Missed = ${T} - ${safeA} = ${missed} lectures`);

  if (target === 100) {
    if (safeA < T) {
      steps.push(
        `Target is 100%: Because ${missed} class(es) have already been missed, mathematical 100% attendance cannot be achieved in a finite number of additional classes.`
      );
    } else {
      steps.push(`Target is 100%: Currently at 100% attendance. Attend all future classes to maintain it.`);
    }
  } else if (consecutiveNeeded > 0) {
    steps.push(
      `Formula: x = ⌈(p × T - A) ÷ (1 - p)⌉ where p = ${p}, T = ${T}, A = ${safeA}`
    );
    steps.push(
      `x = ⌈(${p} × ${T} - ${safeA}) ÷ (1 - ${p})⌉ = ⌈(${(p * T).toFixed(2)} - ${safeA}) ÷ ${(1 - p).toFixed(2)}⌉`
    );
    steps.push(
      `x = ⌈${(p * T - safeA).toFixed(2)} ÷ ${(1 - p).toFixed(2)}⌉ = ⌈${((p * T - safeA) / (1 - p)).toFixed(2)}⌉ = ${consecutiveNeeded}`
    );
    steps.push(
      `Verification: (${safeA} + ${consecutiveNeeded}) ÷ (${T} + ${consecutiveNeeded}) = ${safeA + consecutiveNeeded} ÷ ${T + consecutiveNeeded} = ${(((safeA + consecutiveNeeded) / (T + consecutiveNeeded)) * 100).toFixed(2)}% (≥ ${target}%)`
    );
  } else {
    steps.push(
      `Attendance meets or exceeds target (${currentPercentage}% ≥ ${target}%). No additional consecutive classes required to reach ${target}%.`
    );
    if (allowableFutureAbsences > 0) {
      steps.push(
        `Cushion / Safe Absences: You can miss up to ${allowableFutureAbsences} upcoming consecutive classes and still remain at or above ${target}%.`
      );
      steps.push(
        `Verification: ${safeA} ÷ (${T} + ${allowableFutureAbsences}) = ${((safeA / (T + allowableFutureAbsences)) * 100).toFixed(2)}% (≥ ${target}%)`
      );
    }
  }

  return {
    attended: safeA,
    totalConducted: T,
    percentage: currentPercentage,
    missed,
    targetPercentage: target,
    isEligible,
    status,
    statusLabel,
    consecutiveNeeded,
    isHundredPercentImpossible,
    allowableFutureAbsences,
    formulaExplanation: {
      formula: 'x = max(0, ⌈(p · T - A) / (1 - p)⌉)',
      steps,
    },
  };
}

/**
 * Projects attendance if N remaining classes are conducted in the semester
 */
export function projectRemainingSemester(
  attended: number,
  totalConducted: number,
  remainingClasses: number,
  targetPercentage: number = 75
) {
  const base = calculateAttendance(attended, totalConducted, targetPercentage);
  const remaining = Math.max(0, Math.floor(remainingClasses || 0));
  const finalTotal = base.totalConducted + remaining;
  const p = base.targetPercentage / 100;

  // Minimum classes student must attend out of remaining classes to hit target
  // (A + m) / (T + R) >= p => A + m >= p * (T + R) => m >= p * (T + R) - A
  const neededOverall = Math.ceil(p * finalTotal);
  const mustAttend = Math.max(0, neededOverall - base.attended);
  const canMiss = Math.max(0, remaining - mustAttend);
  const isAchievable = mustAttend <= remaining;

  return {
    ...base,
    projectedTotal: finalTotal,
    remainingClasses: remaining,
    mustAttend: Math.min(mustAttend, remaining),
    canMiss: isAchievable ? canMiss : 0,
    isAchievable,
    neededOverall,
  };
}
