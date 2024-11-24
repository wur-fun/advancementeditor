let triggers = [];

    function addTrigger() {
        const triggerType = document.getElementById('trigger').value;
        const triggerId = `trigger-${Date.now()}`;
        const triggerDiv = document.createElement('div');
        triggerDiv.className = 'trigger-item';
        triggerDiv.id = triggerId;
        triggerDiv.innerHTML = `
            <label>${triggerType}</label>
            <button onclick="removeTrigger('${triggerId}')">移除条件</button>
            ${getTriggerFields(triggerType)}`;
        document.getElementById('triggerList').appendChild(triggerDiv);
        triggers.push({ id: triggerId, type: triggerType, conditions: {} });
        }

    function removeTrigger(triggerId) {
        document.getElementById(triggerId).remove();
        triggers = triggers.filter(trigger => trigger.id !== triggerId);
    }

    function getTriggerFields(type) {
        switch (type) {
            case 'minecraft:inventory_changed':
                return `
                    <div>
                        <label>物品ID</label>
                        <input type="text" class="trigger-input" placeholder="例如：minecraft:diamond" oninput="updateTrigger('${type}', this.value)">
                    </div>`;
            case 'minecraft:player_killed_entity':
                return `
                    <div>
                        <label>目标生物类型</label>
                        <input type="text" class="trigger-input" placeholder="例如：minecraft:zombie" oninput="updateTrigger('${type}', this.value)">
                    </div>`;
            case 'minecraft:location':
                return `
                    <div>
                        <label>位置坐标 (x, y, z)</label>
                        <input type="text" class="trigger-input" placeholder="例如：100 64 200" oninput="updateTrigger('${type}', this.value)">
                   </div>`;
            default:
               return '';
        }
    }

    function updateTrigger(triggerType, value) {
        const trigger = triggers.find(t => t.type === triggerType);
        if (trigger) {
            trigger.conditions.value = value;
        }
    }

    function generateJson() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const icon = document.getElementById('icon').value;
        const showToast = document.getElementById('showToast').checked;
        const announceToChat = document.getElementById('announceToChat').checked;
        const hidden = document.getElementById('hidden').checked;
        const criteria = triggers.reduce((acc, trigger, index) => {
        acc[`criteria_${index}`] = {
            trigger: trigger.type,
            conditions: trigger.conditions
        };
        return acc;
    }, {});

        const jsonData = {
            display: {
                title: { text: title, color: "green" },
                description: { text: description },
                icon: { item: icon },
                frame: "task",
                show_toast: showToast,
                announce_to_chat: announceToChat,
                hidden: hidden
            },
            criteria
        };

        document.getElementById('jsonOutput').textContent = JSON.stringify(jsonData, null, 4);
    }
    function downloadJson() {
        const jsonContent = document.getElementById('jsonOutput').textContent;
        if (!jsonContent || jsonContent === "JSON 结果将在这里显示...") {
            alert("请先生成 JSON！");
            return;
        }
        const blob = new Blob([jsonContent], { type: "application/json" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "advancement.json";
        link.click();
    }
