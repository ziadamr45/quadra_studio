'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, MessageSquare, Lightbulb, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type ReportType = 'question' | 'suggestion' | 'problem';

const reportTypes: { id: ReportType; label: string; icon: typeof AlertTriangle; color: string }[] = [
  { id: 'question', label: 'سؤال', icon: MessageSquare, color: 'text-emerald' },
  { id: 'suggestion', label: 'اقتراح', icon: Lightbulb, color: 'text-copper-light' },
  { id: 'problem', label: 'مشكلة', icon: AlertTriangle, color: 'text-red-400' },
];

export default function ReportModal() {
  const { showReport, setShowReport } = useAppStore();
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!selectedType || !title.trim()) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    toast.success('شكراً لك! تم إرسال البلاغ بنجاح');
    setSelectedType(null);
    setTitle('');
    setDetails('');
    setEmail('');
    setShowReport(false);
  };

  return (
    <Dialog open={showReport} onOpenChange={setShowReport}>
      <DialogContent className="sm:max-w-[460px] bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-copper" />
          <h2 className="text-lg font-bold text-foreground arabic-text">إرسال بلاغ</h2>
        </div>

        <div className="space-y-4">
          {/* Report type */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block arabic-text">
              نوع البلاغ
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                      selectedType === type.id
                        ? 'border-emerald bg-emerald/5'
                        : 'border-border hover:border-emerald/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${type.color}`} />
                    <span className="text-xs font-medium text-foreground arabic-text">
                      {type.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="report-title" className="text-sm text-muted-foreground mb-1.5 block arabic-text">
              العنوان
            </Label>
            <Input
              id="report-title"
              placeholder="عنوان البلاغ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Details */}
          <div>
            <Label htmlFor="report-details" className="text-sm text-muted-foreground mb-1.5 block arabic-text">
              التفاصيل
            </Label>
            <Textarea
              id="report-details"
              placeholder="اشرح المشكلة أو الاقتراح بالتفصيل..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="report-email" className="text-sm text-muted-foreground mb-1.5 block arabic-text">
              البريد الإلكتروني (اختياري)
            </Label>
            <Input
              id="report-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              dir="ltr"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-emerald hover:bg-emerald/90 text-emerald-foreground font-semibold"
          >
            <Send className="w-4 h-4 ml-2" />
            <span className="arabic-text">إرسال البلاغ</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
