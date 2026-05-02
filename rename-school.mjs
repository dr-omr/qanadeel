import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace specific long variations first
    content = content.replace(/روضة ومدرسة قناديل العلم الخاصة للتعليم المبكر/g, 'مدرسة قناديل العلم الخاصة للتعليم المبكر (مرحلة الروضة)');
    content = content.replace(/روضة قناديل العلم الخاصة للتعليم المبكر/g, 'مدرسة قناديل العلم الخاصة للتعليم المبكر (مرحلة الروضة)');
    
    // Replace the short variation
    content = content.replace(/روضة قناديل العلم/g, 'مدرسة قناديل العلم (مرحلة الروضة)');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`\n✅ تم تحديث الاسم في ${count} ملفات بنجاح!`);
