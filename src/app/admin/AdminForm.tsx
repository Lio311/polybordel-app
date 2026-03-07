'use client';

import React, { useState, useRef } from 'react';
import { submitNewBet } from './actions';
import styles from './Admin.module.css';

export default function AdminForm() {
    const [yesProb, setYesProb] = useState(50);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const noProb = 100 - yesProb;

    async function handleSubmit(formData: FormData) {
        setSubmitting(true);
        setSuccess(false);
        formData.set('yesProb', String(yesProb));
        try {
            await submitNewBet(formData);
            setSuccess(true);
            formRef.current?.reset();
            setYesProb(50);
        } catch (e: any) {
            alert('שגיאה: ' + (e.message || 'לא ניתן ליצור הימור'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form ref={formRef} action={handleSubmit} className={styles.form}>

            {/* Title */}
            <div className={styles.field}>
                <label className={styles.label}>כותרת השוק</label>
                <input
                    name="title"
                    required
                    className={styles.input}
                    placeholder="האם X יקרה לפני..."
                    dir="rtl"
                />
            </div>

            {/* Description */}
            <div className={styles.field}>
                <label className={styles.label}>תיאור וכללים</label>
                <textarea
                    name="description"
                    required
                    className={styles.textarea}
                    placeholder="כתוב את כללי ההכרעה..."
                    dir="rtl"
                    rows={3}
                />
            </div>

            {/* Image URL */}
            <div className={styles.field}>
                <label className={styles.label}>קישור לתמונה</label>
                <input
                    name="imageUrl"
                    type="url"
                    required
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                />
            </div>

            {/* Category */}
            <div className={styles.field}>
                <label className={styles.label}>קטגוריה</label>
                <select name="category" required className={styles.input} defaultValue="breaking">
                    <option value="breaking">חדשות</option>
                    <option value="sports">ספורט</option>
                    <option value="politics">פוליטיקה</option>
                    <option value="economy">כלכלה</option>
                    <option value="entertainment">בידור</option>
                    <option value="geopolitics">גיאופוליטיקה</option>
                    <option value="tech">טכנולוגיה</option>
                </select>
            </div>

            {/* End Date */}
            <div className={styles.field}>
                <label className={styles.label}>תאריך סיום</label>
                <input
                    name="endDate"
                    type="datetime-local"
                    required
                    className={styles.dateInput}
                />
            </div>

            {/* Probability Slider */}
            <div className={styles.field}>
                <label className={styles.label}>יחס סיכויים ראשוני</label>
                <div className={styles.probRow}>
                    <div className={styles.probLabel}>
                        <span className={styles.probYes}>כן</span>
                        <strong className={styles.probYesNum}>{yesProb}%</strong>
                    </div>
                    <div className={styles.sliderWrapper}>
                        <div
                            className={styles.sliderFill}
                            style={{ width: `${yesProb}%` }}
                        />
                        <input
                            type="range"
                            name="yesProb"
                            min={1}
                            max={99}
                            value={yesProb}
                            onChange={e => setYesProb(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>
                    <div className={styles.probLabel}>
                        <strong className={styles.probNoNum}>{noProb}%</strong>
                        <span className={styles.probNo}>לא</span>
                    </div>
                </div>
                {/* Visual bar */}
                <div className={styles.probBar}>
                    <div className={styles.probBarYes} style={{ flex: yesProb }} />
                    <div className={styles.probBarNo} style={{ flex: noProb }} />
                </div>
            </div>

            {success && (
                <div className={styles.successMsg}>✓ השוק נוצר בהצלחה!</div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'יוצר...' : '+ צור שוק חדש'}
            </button>
        </form>
    );
}
