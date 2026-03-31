import express from 'express';
import { authenticateToken } from '../utils/token.js';
import { saveAnalysis, getUserAnalyses } from '../utils/db.js';
import { validateSymptoms } from '../utils/validation.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../config.js';

const router = express.Router();

// ============================================
// SAVE ANALYSIS
// ============================================

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { symptoms, diagnosisResults, recommendedMedicines, homeRemedies, emergencyFlag, emergencyMessage } = req.body;

        // Validate symptoms
        const symptomValidation = validateSymptoms(symptoms);
        if (!symptomValidation.valid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: symptomValidation.message
            });
        }

        // Save analysis to database
        const analysis = await saveAnalysis({
            user_id: req.userId,
            symptoms: symptoms,
            diagnosis_results: diagnosisResults || {},
            recommended_medicines: recommendedMedicines || [],
            home_remedies: homeRemedies || [],
            emergency_flag: emergencyFlag || false,
            emergency_message: emergencyMessage || null
        });

        res.status(201).json({
            message: SUCCESS_MESSAGES.ANALYSIS_SAVED,
            analysis: {
                id: analysis.id,
                symptoms: analysis.symptoms,
                results: analysis.diagnosis_results,
                medicines: analysis.recommended_medicines,
                emergency: analysis.emergency_flag,
                createdAt: analysis.created_at
            }
        });

    } catch (error) {
        console.error('Analysis save error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR,
            message: error.message
        });
    }
});

// ============================================
// GET USER ANALYSES
// ============================================

router.get('/', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const analyses = await getUserAnalyses(req.userId, limit);

        res.status(HTTP_STATUS.OK).json({
            analyses: analyses.map(a => ({
                id: a.id,
                symptoms: a.symptoms,
                results: a.diagnosis_results,
                medicines: a.recommended_medicines,
                remedies: a.home_remedies,
                emergency: a.emergency_flag,
                createdAt: a.created_at
            })),
            count: analyses.length
        });

    } catch (error) {
        console.error('Get analyses error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

// ============================================
// GET ANALYSIS BY ID
// ============================================

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.userId)
            .single();

        if (error || !data) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                error: ERROR_MESSAGES.NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            analysis: {
                id: data.id,
                symptoms: data.symptoms,
                results: data.diagnosis_results,
                medicines: data.recommended_medicines,
                remedies: data.home_remedies,
                emergency: data.emergency_flag,
                createdAt: data.created_at
            }
        });

    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
            error: ERROR_MESSAGES.INTERNAL_ERROR
        });
    }
});

export default router;
